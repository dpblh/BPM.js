export const loadHistory = async (fetch, id) => {
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: `query($id: String!) {
          historyOfScheme(id: $id){
            id,
            name { value, timestamp },
            desc { value, timestamp },
            startNode { value, timestamp },
          }
        }`,
      variables: {
        id,
      },
    }),
  });
  const { data } = await resp.json();
  if (!data || !data.historyOfScheme)
    throw new Error('Failed to load the news feed.');
  return data.historyOfScheme;
};

export const loadGraph = async (fetch, id, timestamp) => {
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: `query($id: String!, $timestamp: Float!) {
          scheme(id: $id, timestamp: $timestamp){
            id,
            name,
            desc,
            startNode,
            removed,
            graph{
              edges{
                id,
                source,
                target,
                roles,
                condition,
                immediate
              },
              nodes{
                id,
                name,
                desc,
                position{x,y},
                scheme
              }
            }
          }
        }`,
      variables: {
        id,
        timestamp,
      },
    }),
  });
  const { data } = await resp.json();
  if (!data || !data.scheme) throw new Error('Failed to load the news feed.');
  return data.scheme;
};

export const saveGraph = async (fetch, variables) => {
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: `mutation($id: String!, $name: String!, $desc: String!, $startNode: String!, $nodes: [NodeInput], $edges: [EdgeInput], $removed: Boolean) {
          scheme(id: $id, name: $name, desc: $desc, startNode: $startNode, nodes: $nodes, edges: $edges, removed: $removed) {
            id,
            name,
            desc,
            startNode,
            removed,
            graph{
              edges{
                id,
                source,
                target,
                roles,
                condition,
                immediate
              },
              nodes{
                id,
                name,
                desc,
                position{x,y},
                scheme
              }
            }
          }
        }`,
      variables,
    }),
  });
  const { data } = await resp.json();
  if (!data || !data.scheme) throw new Error('Failed to load the news feed.');
  return data.scheme;
};

export const loadSchemes = async fetch => {
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: `{
      schemes{
        id,
        name,
        desc,
        startNode
      }
    }`,
    }),
  });
  const { data } = await resp.json();
  if (!data || !data.schemes) throw new Error('Failed to load the news feed.');
  return data.schemes;
};

export default fetch => ({
  loadSchemes: () => loadSchemes(fetch),
});
