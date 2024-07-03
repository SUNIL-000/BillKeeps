export const bodyValidator = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    // console.log(parseBody);

    req.body = parseBody?.body;
    req.query = parseBody?.query;
    req.params = parseBody?.params;

    next();
  } catch (err) {
    const msg = err?.errors[0]?.message;
    console.log(err)
    return res.status(400).json({
      message: msg,
      success: false,
    
    });
  }
};
