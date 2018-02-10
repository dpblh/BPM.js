export const loadProcesses = async (fetch, { query, skip, limit }) => {
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: `query($query: String, $skip: Int, $limit: Int) {
          processes(query: $query, skip: $skip, limit: $limit){
            id,
            scheme,
            status
          }
        }`,
      variables: {
        query,
        skip: parseInt(skip),
        limit: parseInt(limit),
      },
    }),
  });
  const { data } = await resp.json();
  if (!data || !data.processes) {
    throw new Error(resp.statusText);
  }
  return data.processes;
};

export default fetch => ({
  loadProcesses: id => loadProcesses(fetch, id),
});
