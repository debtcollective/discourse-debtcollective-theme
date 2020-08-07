import { build, fake } from "@jackfranklin/test-data-bot";

const buildUser = build("User", {
  fields: {
    email: fake(f => f.internet.email(null, null, "debtcollective.org")),
    username: fake(f => f.internet.userName()),
    name: fake(f => f.name.findName()),
    password: fake(f => f.internet.password()),
    zipCode: fake(f => f.address.zipCode()),
    phoneNumber: fake(f => f.phone.phoneNumber("(###) ###-####"))
  }
});

export { buildUser };
