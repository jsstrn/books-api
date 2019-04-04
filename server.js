const app = require("./app");
const { sequelize } = require("./models");

const port = process.env.PORT || 5555;

sequelize
  .authenticate()
  .then(() => {
    console.log("🎉 Successfully connected to Postgres");
  })
  .catch(err => {
    console.error("🙅‍♀️ Unable to connect to Postgres", err);
  });

sequelize.sync({ force: true }).then(() => {
  console.log("✅ Sync is complete");
});

app.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    console.log(`Server is running on Heroku with port number ${port}`);
  } else {
    console.log(`Server is running on http://localhost:${port}`);
  }
});
