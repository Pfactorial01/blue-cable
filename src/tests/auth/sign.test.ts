import { expect, should } from "chai";
import chai from "chai";
import chatHttp from "chai-http";
import app from  "../../server"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const assert = chai.assert;
should();
const User = {
    fullname: "test",
    password: "qeadzc1234",
    email: "user@gmail.com",
    admin: "false"
}
chai.use(chatHttp);

describe("SignUp tests", () => {

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

    it("Should throw error when fullname is missing", (done) => {
        chai
            .request(app)
            .post("/api/v1/auth/signup")
            .send({ email: User.email, password: User.password  })
            .end((err, res) => {
            res.should.have.status(400);
            expect(res.body.message).to.equal("fullname, email or password missing");
            done();
            });
        });

    it("Should throw error when email is missing", (done) => {
        chai
            .request(app)
            .post("/api/v1/auth/signup")
            .send({ fullname: User.fullname, password: User.password  })
            .end((err, res) => {
            res.should.have.status(400);
            expect(res.body.message).to.equal("fullname, email or password missing");
            done();
            });
        });
    it("Should throw error when password is missing", (done) => {
        chai
            .request(app)
            .post("/api/v1/auth/signup")
            .send({ fullname: User.fullname, email: User.email  })
            .end((err, res) => {
            res.should.have.status(400);
            expect(res.body.message).to.equal("fullname, email or password missing");
            done();
            });
        });
    it("Should signup succcesfully", (done) => {
        chai
            .request(app)
            .post("/api/v1/auth/signup")
            .send({ fullname: User.fullname, email: User.email, password: User.password  })
            .end((err, res) => {
            res.should.have.status(200);
            expect(res.body.message).to.equal("success");
            done();
            });
        })
    it("Should throw error when User already exists", (done) => {
            chai
                .request(app)
                .post("/api/v1/auth/signup")
                .send({ fullname: User.fullname, email: User.email, password: User.password  })
                .end((err, res) => {
                res.should.have.status(400);
                expect(res.body.message).to.equal("user already exists");
                done();
            });
        })
})