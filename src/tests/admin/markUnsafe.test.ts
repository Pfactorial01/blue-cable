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
  fullname: "regular user",
  password: "qeadzc1234",
  email: "regular-testuser@gmail.com",
}

let File = {
  id: "clkghtyetvi232dew",
  name: "testFile",
  key: "testKey",
  type: "image/jpg",
  size: 1000
}

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
                fullname: RegularUser.fullname,
                password: await hash(RegularUser.password, 12),
                email: RegularUser.email,
                role: ROLE.REGULAR
            }
          });
          const createdFile = await prisma.file.create({
            data: {
              id: File.id,
              name: File.name,
              key: File.key,
              type: File.type,
              size: File.size,
              userId: createdAdminUser.id
            }
          })      
        } catch (error) {
          console.log(error)
        }
      });

    after(async () => {
        try {
          await prisma.file.delete({
            where: {
              id: File.id,
            }
          })
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
                .post(`/api/v1/admin/mark-file-unsafe`)
                .send({fileId: File.id})
                .end((err, res) => {
                res.should.have.status(401);
                expect(res.body.message).to.equal("Unauthorized");
                done();
                });
            });
            })

    it("Should mark file unsafe succesfully", (done) => {
      const agent = chai.request.agent(app)
      agent.post("/api/v1/auth/login")
          .send({
              email: AdminUser.email,
              password: AdminUser.password,
          }).then(async (res) => {
              agent
              .post(`/api/v1/admin/mark-file-unsafe`)
              .send({fileId: File.id})
              .end((err, res) => {
              // res.should.have.status(200);
              expect(res.body.message).to.equal("File marked as unsafe succesfully");
              done();
              });
          });
        })

    it("Should throw fileId missing error", (done) => {
      const agent = chai.request.agent(app)
      agent.post("/api/v1/auth/login")
          .send({
              email: AdminUser.email,
              password: AdminUser.password,
          }).then(async (res) => {
              agent
              .post(`/api/v1/admin/mark-file-unsafe`)
              .end((err, res) => {
              res.should.have.status(400);
              expect(res.body.message).to.equal("fileId missing");
              done();
              });
            });
          })
})