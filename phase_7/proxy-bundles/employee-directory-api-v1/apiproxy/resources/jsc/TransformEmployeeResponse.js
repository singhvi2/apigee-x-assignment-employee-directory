var raw = context.getVariable("response.content");

try {
  var data = JSON.parse(raw);

  // 1. Check if it's an array or a single object and transform accordingly
  var employees = Array.isArray(data)
    ? data.map(function (user) {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          company: user.company ? user.company.name : null,
        };
      })
    : {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company ? data.company.name : null,
      };

  // 2. Wrap the result under the "employees" root property
  // (If `employees` was a single object, this wraps it as { employees: {id: ...} },
  // or if it was an array, it becomes { employees: [...] })
  var transformedResponse = {
    employees: employees,
  };

  // 3. Set the transformed response back to context
  context.setVariable("response.content", JSON.stringify(transformedResponse));
  context.setVariable("response.header.content-type", "application/json");
} catch (e) {
  // Leave the original response untouched if parsing fails
}
