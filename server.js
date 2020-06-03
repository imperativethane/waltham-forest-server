const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler')
const morgan = require('morgan');
const mongoose = require('mongoose');
const graphqlHttp = require('express-graphql');
require('dotenv/config');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}))

mongoose.connect(`mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@waltham-forest-htr4z.mongodb.net/${process.env.DATABASE_DB}?retryWrites=true&w=majority
`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening on ${PORT}`);
    });
})
.catch(err => {
    console.log(err);
}); 

app.use(errorhandler());