import { GraphQLSchema } from 'graphql'
import { visitSchema, VisitSchemaKind, renameType } from 'graphql-tools'
import { Utils } from '../utils'

export const filterSchema = (schema: GraphQLSchema, { prefix, timer }: Utils) => {
  const filterSchemaTimer = timer()

  const filteredSchema = visitSchema(schema, {
    [VisitSchemaKind.MUTATION]() {
      return null
    },
    [VisitSchemaKind.INPUT_OBJECT_TYPE]() {
      return null
    },
    [VisitSchemaKind.OBJECT_TYPE](type) {
      return renameType(type, prefix(type.name))
    },
    [VisitSchemaKind.INTERFACE_TYPE](type) {
      if (type.name !== 'Node') return renameType(type, prefix(type.name))
      return type
    },
    [VisitSchemaKind.UNION_TYPE](type) {
      return renameType(type, prefix(type.name))
    },
    [VisitSchemaKind.ENUM_TYPE](type) {
      return renameType(type, prefix(type.name))
    }
  })
  filterSchemaTimer.log('Filtered schema in %s')

  return filteredSchema
}
