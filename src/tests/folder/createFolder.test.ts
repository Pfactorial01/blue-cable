import { expect, should } from "chai";
import chai from "chai";
import chatHttp from "chai-http";
import app from  "../../server";
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

describe("Logout tests", () => {

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

    


    it("Should throw folder name missing error", (done) => {
        const agent = chai.request.agent(app)
        agent
            .post("/api/v1/auth/login")
            .send({
                email: User.email,
                password: User.password,
            })
            .then(async (res) => {
                agent
                .post("/api/v1/folder/create")
                .end((err, res) => {
                res.should.have.status(400);
                expect(res.body.message).to.equal("folderName missing");
                done();
                });
            })
        });

    it("Should create folder succesfully", (done) => {
        const agent = chai.request.agent(app)
        agent
            .post("/api/v1/auth/login")
            .send({
                email: User.email,
                password: User.password,
            })
            .then(async (res) => {
                agent
                    .post("/api/v1/folder/create")
                    .send({folderName: "test"})
                    .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body.message).to.equal("Folder created");
                    done();
                });
            })
        })

    it("Should throw folder already exists error", (done) => {
        const agent = chai.request.agent(app)
        agent
            .post("/api/v1/auth/login")
            .send({
                email: User.email,
                password: User.password,
            })
            .then(async (res) => {
                agent
                    .post("/api/v1/folder/create")
                    .send({folderName: "test"})
                    .end((err, res) => {
                    res.should.have.status(400);
                    expect(res.body.message).to.equal("Folder already exists");
                    done();
                });
            })
        })
})