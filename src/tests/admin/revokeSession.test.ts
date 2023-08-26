import { expect, should } from "chai";
import chai from "chai";
import chatHttp from "chai-http";
import app from  "../../server";
import { PrismaClient, ROLE } from '@prisma/client';
import {hash} from 'bcrypt';

const prisma = new PrismaClient()

const assert = chai.assert;
should();
const AdminUser = {
    fullname: "test",
    password: "qeadzc1234",
    email: "testuser@gmail.com",
}

const RegularUser = {
  id: "clkghr73befef",
  fullname: "regular user",
  password: "qeadzc1234",
  email: "regular-testuser@gmail.com",
}

const nonExistingUserId = "cljsdurebuwu238bne2r"

chai.use(chatHttp);

describe("MarkUnsafe tests", () => {

    before(async () => {
        try {
          const createdAdminUser = await prisma.user.create({
            data: {
                fullname: AdminUser.fullname,
                password: await hash(AdminUser.password, 12),
                email: AdminUser.email,
                role: ROLE.ADMIN
            }
          });
          const createdRegularUser = await prisma.user.create({
            data: {
                id: RegularUser.id,
                fullname: RegularUser.fullname,
                password: await hash(RegularUser.password, 12),
                email: RegularUser.email,
                role: ROLE.REGULAR
            }
          });   
        } catch (error) {
          console.log(error)
        }
      });

    after(async () => {
        try {
          await prisma.user.deleteMany({
            where: {
                email: {
                  contains: 'test'
                }
            }
          });
        } catch (error) {
          console.log(error)
        }
      });

    it("Should throw unauthorized error for non Admin user", (done) => {
        const agent = chai.request.agent(app)
        agent.post("/api/v1/auth/login")
            .send({
                email: RegularUser.email,
                password: RegularUser.password,
            }).then(async (res) => {
                agent
                .post(`/api/v1/admin/revoke-session-token`)
                .end((err, res) => {
                res.should.have.status(401);
                expect(res.body.message).to.equal("Unauthorized");
                done();
                });
            });
        })

    it("Should throw userId missing error", (done) => {
        const agent = chai.request.agent(app)
        agent.post("/api/v1/auth/login")
            .send({
                email: AdminUser.email,
                password: AdminUser.password,
            }).then(async (res) => {
                agent
                .post(`/api/v1/admin/revoke-session-token`)
                .end((err, res) => {
                res.should.have.status(400);
                expect(res.body.message).to.equal("userId missing");
                done();
                });
            });
        })

    it("Should throw user not found error", (done) => {
        const agent = chai.request.agent(app)
        agent.post("/api/v1/auth/login")
            .send({
                email: AdminUser.email,
                password: AdminUser.password,
            }).then(async (res) => {
                agent
                .post(`/api/v1/admin/revoke-session-token`)
                .send({userId: nonExistingUserId})
                .end((err, res) => {
                res.should.have.status(404);
                expect(res.body.message).to.equal("user not found");
                done();
                });
            });
        })

    it("Should delete session succesfully", (done) => {
        chai.request(app)
        .post("/api/v1/auth/login")
        .send({email: RegularUser.email,
            password: RegularUser.password,})
        const agent = chai.request.agent(app)
        agent.post("/api/v1/auth/login")
            .send({
                email: AdminUser.email,
                password: AdminUser.password,
            }).then(async (res) => {
                agent
                .post(`/api/v1/admin/revoke-session-token`)
                .send({userId: RegularUser.id})
                .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.message).to.equal("session deleted");
                done();
                });
            });
        })

})