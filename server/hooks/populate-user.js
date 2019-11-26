// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

/* eslint-disable require-atomic-updates */
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    // Get `app`, `method`, `params` and `result` from the hook context
    const { app, method, result, params } = context;
    // Function that adds the user to a single comment object
    const addUser = async comment => {
      // Get the user based on their id, pass the `params` along so
      // that we get a safe version of the user data
      const user = await app.service('users').get(comment.userId, params);

      // Merge the message content to include the `user` object
      return {
        ...comment,
        user
      };
    };

    // In a find method we need to process the entire page
    if (method === 'find') {
      // Map all data to include the `user` information
      context.result.data = await Promise.all(result.data.map(addUser));
    } else {
      // Otherwise just update the single result
      context.result = await addUser(result);
    }

    return context;
  };
};
