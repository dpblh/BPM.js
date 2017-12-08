import {
  GraphQLObjectType as ObjectType,
  GraphQLScalarType as ScalarType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList as ListType,
  GraphQLInt as IntType,
} from 'graphql';

import EdgeType from './EdgeType';

const TimeStampListEdgeType = new ObjectType({
  name: 'TimeStampListEdge',
  fields: {
    timestamp: { type: new NonNull(IntType) },
    value: { type: new NonNull(new ListType(EdgeType)) },
  },
});

export default TimeStampListEdgeType;
