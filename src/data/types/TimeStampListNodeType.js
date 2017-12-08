import {
  GraphQLObjectType as ObjectType,
  GraphQLScalarType as ScalarType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList as ListType,
  GraphQLInt as IntType,
} from 'graphql';

import NodeType from './NodeType';

const TimeStampListNodeType = new ObjectType({
  name: 'TimeStampListNode',
  fields: {
    timestamp: { type: new NonNull(IntType) },
    value: { type: new NonNull(new ListType(NodeType)) },
  },
});

export default TimeStampListNodeType;
