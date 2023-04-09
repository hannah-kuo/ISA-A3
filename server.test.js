const request = require("supertest");
const authServer = require("./authServer");
const appServer = require("./appServer");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


beforeAll(async () => {
	const url =
		"mongodb+srv://root:Wie1uwyhsWOmsDnv@cluster0.whplb.mongodb.net/test";
	await mongoose.connect(url, { useNewUrlParser: true });
});

AUTHORIZATION_STRING = "";
ACCESS_TOKEN = "";
REFRESH_TOKEN = "";


describe("POST /register", () => {
	it("Test that the /register endpoint creates a new user in the database with the correct hashed password", async () => {
		let randomNumber = Math.floor(Math.random() * 10000);
		const res = await request(authServer).post("/register").send({
			"username": "test" + randomNumber,
			"password": "test" + randomNumber,
			"email": "test" + randomNumber + "@test.ca",
			"admin": false
		});
		const isPasswordCorrect = await bcrypt.compare("test" + randomNumber, res.body.password)
		expect(res.statusCode).toBe(200);
		expect(isPasswordCorrect).toBe(true);
	});
});


describe("POST /login", () => {
	it("Test that the /login endpoint returns a JWT access token and refresh token for valid credentials", async () => {
		const res = await request(authServer)
			.post("/login")
			.send({ username: "admin", password: "admin" });

		expect(res.status).toBe(200);
		expect(res.body.username).toBe("admin");
		AUTHORIZATION_STRING = res.headers.authorization;

		// header parsing goes here
		ACCESS_TOKEN = AUTHORIZATION_STRING?.split("Bearer ")[1].split(" Refresh")[0];
		REFRESH_TOKEN = AUTHORIZATION_STRING?.split("Refresh ")[1];

	})
});

describe("POST /login", () => {
	it("Test that the login endpoint throws a PokemonAuthError for invalid credentials", async () => {
		const res = await request(authServer).post("/login").send({
			"username": "test3580",
			"password": "test35801",
		});
		expect(res.status).toBe(401);
		expect(res.error.text.includes('Authentication Error')).toBe(true);
	});
});


describe("POST /requestNewAccessToken", () => {
	it("Test that the /requestNewAccessToken endpoint returns a new JWT access token for a valid refresh token", async () => {

		const res1 = await request(authServer).post("/login").send({
			"username": "admin",
			"password": "admin",
		});

		const res = await (await request(authServer).post("/requestNewAccessToken")
			.set('Authorization', AUTHORIZATION_STRING));

		expect(res.status).toBe(200);
	});
});


describe("POST /requestNewAccessToken", () => {
	it("Test that the /requestNewAccessToken endpoint throws a PokemonAuthError for an invalid or missing refresh token", async () => {

		const refreshT = 'foo';
		const res = await (await request(authServer).post("/requestNewAccessToken")
			.set('Authorization', refreshT));
		expect(res.status).toBe(401);
		expect(res.error.text.includes('Invalid Token: Please provide a valid token.')).toBe(true);
	});
});


describe("Test successful GET request", () => {
    it("Successful GET request for Ponyta", async () => {
        console.log("Access token is : " + AUTHORIZATION_STRING);
        const res = await request(appServer)
            .get("/api/v1/pokemon?id=77")
            .set({"Authorization": AUTHORIZATION_STRING});
        console.log("response body is :");
        console.log(res.body);
        console.log(res.body[0].id);
        expect(res.status).toBe(200);
        expect(res.body[0].id).toBe(77);
    })
});

describe("Test unsuccessful GET request", () => {
	it("Unsuccessful GET request for Ponyta", async () => {
		const res = await request(appServer)
			.get("/api/v1/pokemon?id=77&appid")
			.set({ "Authorization": "foo" });
		expect(res.status).toBe(500);  
	})
});


describe("GET /api/v1/pokemons", () => {
	it("Test that an unauthenticated user cannot access protected endpoints", async () => {

		const res = await request(appServer).get("/api/v1/pokemon?id=77&appid").query({ count: 10, after: 0 });

		expect(res.status).toBe(401);
	});
});


describe("GET /api/v1/pokemons", () => {
	it("Test that an expired JWT access token cannot be used to access protected endpoints", async () => {
		const res1 = await request(authServer).post("/login").send({
			"username": "test3580",
			"password": "test3580",
		});
		const refreshT = jwt.sign({ user: "test3580" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '0s' })

		const res = await request(appServer).get("/api/v1/pokemons").query({ count: 10, after: 0 }).set('auth-token-access', `${refreshT}`);

		expect(res.status).toBe(401);
	});
});


describe("GET /api/v1/pokemons", () => {
    it("Test that a request with an invalid JWT access token throws a PokemonAuthError", async () => {
        const res1 = await request(authServer).post("/login").send({
            "username": "test3580",
            "password": "test3580",
        });

        const refreshT = 'abc';
        const res = await request(appServer).get("/api/v1/pokemons").query({count: 10, after: 0}).set('auth-token-access', `${refreshT}`);

        expect(res.status).toBe(401);     
        expect(res.error.text.includes('No Token: Please provide the access token using the headers.')).toBe(true);
    });
});

describe("GET /api/v1/pokemons", () => {
	it("Test that a refresh token cannot be used to access protected endpoints", async () => {
		const res1 = await request(authServer).post("/login").send({
			"username": "test3580",
			"password": "test3580",
		});
		const refreshT = res1.header["auth-token-refresh"];

		const res = await request(appServer).get("/api/v1/pokemons").query({ count: 10, after: 0 }).set('auth-token-refresh', `${refreshT}`);

		expect(res.status).toBe(401);
	});
});


describe("GET /api/v1/pokemons", () => {
	it("Test that a request with an invalid or missing refresh token throws a PokemonAuthError", async () => {

		const res = await request(appServer).get("/api/v1/pokemons").query({ count: 10, after: 0 });
		expect(res.status).toBe(401);
		expect(res.error.text.includes('No Token: Please provide the access token using the headers.')).toBe(true);
	});
});


describe("PATCH /api/v1/pokemon/:id", () => {
	it("Test that non-admin user cannot access admin protected routes", async () => {
		const res1 = await request(authServer).post("/login").send({
			"username": "test3580",
			"password": "test3580",
		});
		const refreshT = res1.header["auth-token-access"];

		const res = await request(appServer).patch("/api/v1/pokemon/1").send(
			{
				"name": {
					"english": "test",
					"japanese": "test",
					"chinese": "test",
					"french": "test"
				},
				"base": {
					"HP": 60,
					"Defense": 75,
					"Speed": 30,
					"Special Attack": 35,
					"Special Defense": 25
				},

				"id": 1,
				"type": [
					"Bug"
				],
				"__v": 0
			}
		).set('auth-token-access', `${refreshT}`);

		expect(res.status).toBe(401);
		expect(res.error.text.includes('No Token: Please provide the access token using the headers.')).toBe(true);
	});
});


describe("GET /logout", () => {
	it("Test that after logging out, a user cannot access protected routes until the user re-login", async () => {
		const res1 = await request(authServer).post("/login").send({
			"username": "test3580",
			"password": "test3580",
		});
		const refreshT = res1.header["auth-token-access"];
		const res2 = await request(authServer).get("/logout").query({ appid: res1.body['_id'] });
		expect(res2.status).toBe(200);

		const res = await request(appServer).get("/api/v1/pokemons").query({ count: 10, after: 0 }).set('auth-token-access', `${refreshT}1`);
		expect(res.status).toBe(401);
	});
});


afterAll(async () => {
	await mongoose.connection.close();
});