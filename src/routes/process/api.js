export const loadProcess = async (fetch, id) => {
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: `query($id: String!) {
          process(id: $id){
            id,
            scheme,
            status,
            context { 
              id, 
              parentContextId,
              stack { 
                id,
                name,
                desc,
                start_t, 
                finish_t,
                variables
              } 
            },
          }
        }`,
      variables: {
        id,
      },
    }),
  });
  const { data } = await resp.json();
  if (!data || !data.process) {
    throw new Error('Failed to load the news feed.');
  }
  return data.process;
};

export default fetch => ({
  loadProcess: id => loadProcess(fetch, id),
});
