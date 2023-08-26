import { expect, should } from "chai";
import chai from "chai";
import chatHttp from "chai-http";
import app from  "../../server"
import { PrismaClient } from '@prisma/client';
import {hash} from 'bcrypt';

const prisma = new PrismaClient()

const assert = chai.assert;
should();
const User = {
    fullname: "test",
    password: "qeadzc1234",
    email: "user@gmail.com",
}

chai.use(chatHttp);

describe("Login tests", () => {

    before(async () => {
        try {
          const passwordHash = await hash(User.password, 12);
          await prisma.user.create({
            data: {
                fullname: User.fullname,
                password: passwordHash,
                email: User.email
            }
          });
        } catch (error) {
          console.log(error)
        }
      });

    after(async () => {
        try {
          await prisma.user.delete({
            where: {
                email: User.email
            }
          });
        } catch (error) {
          console.log(error)
        }
      });

    it("Should throw error when email is missing", (done) => {
        chai
            .request(app)
            .post("/api/v1/auth/login")
            .send({ email: User.email })
            .end((err, res) => {
            res.should.have.status(400);
            expect(res.body.message).to.equal("email or password missing");
            done();
            });
        });

    it("Should throw error when password is missing", (done) => {
        chai
            .request(app)
            .post("/api/v1/auth/login")
            .send({ email: User.email })
            .end((err, res) => {
            res.should.have.status(400);
            expect(res.body.message).to.equal("email or password missing");
            done();
            });
        });

    it("Should throw error when user doesn't exist", (done) => {
        chai
            .request(app)
            .post("/api/v1/auth/login")
            .send({ email: "terence@gmail.com", password: "wesdxc1234" })
            .end((err, res) => {
            res.should.have.status(404);
            expect(res.body.message).to.equal("user not found");
            done();
            });
        });

    it("Should throw error when password is incorrect", (done) => {
        chai
            .request(app)
            .post("/api/v1/auth/login")
            .send({ email: User.email, password: "wrongpassword" })
            .end((err, res) => {
            res.should.have.status(400);
            expect(res.body.message).to.equal("password incorrect");
            done();
            });
        });

        
    it("Should login successfully when all details are correct", (done) => {
        chai
            .request(app)
            .post("/api/v1/auth/login")
            .send({ email: User.email, password: User.password })
            .end((err, res) => {
            res.should.have.status(200);
            expect(res.body.message).to.equal("success");
            done();
            });
        });
})