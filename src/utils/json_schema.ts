import { InputData, jsonInputForTargetLanguage, quicktype } from 'quicktype-core'
import { JSONSchemaFaker } from 'json-schema-faker'

export interface JSONSchema {
  type: 'null' | 'string' | 'integer' | 'number' | 'array' | 'object' | 'boolean';
  properties?: {
    [key: string]: JSONSchema;
  };
  items?: JSONSchema;
  required?: string[];
  description?: string;
  default?: any;
}


export function jsonSchemaMap(schema: JSONSchema, map: (s: JSONSchema) => void) {
  if (!schema) return

  map(schema)

  if (schema.type === 'object' && schema.properties) {
    for (const [_, property] of Object.entries(schema.properties)) {
      map(property)
    }
  }
}

function resolveRefs(schema: any, definitions: any): any {
  if (typeof schema !== 'object' || schema === null) return schema

  if (schema.$ref) {
    const ref = schema.$ref.replace(/^#\/definitions\//, '')
    return resolveRefs(definitions[ref], definitions)
  }

  for (const key in schema) {
    schema[key] = resolveRefs(schema[key], definitions)
  }
  return schema
}

export async function jsonToJSONSchema(jsonString?: string): Promise<JSONSchema | undefined> {
  if (!jsonString) return undefined

  try {
    const jsonInput = jsonInputForTargetLanguage('schema')
    await jsonInput.addSource({
      name: 'GenerateSchema',
      samples: [jsonString]
    })

    const inputData = new InputData()
    inputData.addInput(jsonInput)

    const { lines } = await quicktype({
      inputData,
      lang: 'schema'
    })

    const schema = JSON.parse(lines.join('\n'))

    if (schema.definitions) {
      const mainSchema = schema.definitions['GenerateSchema']
      return resolveRefs(mainSchema, schema.definitions)
    }

    return schema
  } catch (_) {
    return undefined
  }
}

export function generateSchema(jsonString?: string): string | undefined {
  if (jsonString) {
    const schema: JSONSchema = JSON.parse(jsonString)
    jsonSchemaMap(schema, s => {
      if (s.type === 'object' && s.properties) {
        s.required = Object.keys(s.properties)
      }
    })

    JSONSchemaFaker.option({
      defaultInvalidTypeProduct: false,
      alwaysFakeOptionals: false
    })
    const data = JSONSchemaFaker.generate(schema)

    return JSON.stringify(data, null, 2)
  }
  return undefined
}

export function generateSchemaFromRaw(jsonRaw?: string): string | undefined {
  if (jsonRaw) {
    return generateSchema(atob(jsonRaw))
  }
  return undefined
}

export function mergeSchemas(schema1: JSONSchema, schema2?: JSONSchema): JSONSchema {
  const mergedSchema: JSONSchema = { ...schema1 }

  if (!schema2) return mergedSchema

  if (schema1.properties || schema2.properties) {
    mergedSchema.properties = { ...schema1.properties }

    if (schema2.properties) {
      for (const key in schema2.properties) {
        if (!mergedSchema.properties![key]) {
          mergedSchema.properties![key] = schema2.properties[key]
        } else {
          mergedSchema.properties![key] = mergeSchemas(
            schema1.properties![key],
            schema2.properties[key]
          )
        }
      }
    }
  }

  if (schema1.items) {
    mergedSchema.items = schema1.items
  } else if (schema2.items) {
    mergedSchema.items = schema2.items
  }

  const required1 = schema1.required || []
  const required2 = schema2.required || []
  mergedSchema.required = Array.from(new Set([...required1, ...required2]))

  mergedSchema.description = schema1.description ?? schema2.description
  mergedSchema.default = schema1.default ?? schema2.default

  return mergedSchema
}