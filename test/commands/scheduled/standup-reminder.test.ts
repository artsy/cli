import { expect, test } from "@oclif/test"

describe("scheduled:standup-reminder", () => {
  beforeEach(() => {
    process.env.OPSGENIE_API_KEY = "test"
  })
  afterEach(() => {
    delete process.env.OPSGENIE_API_KEY
  })
  test
    .nock("https://api.opsgenie.com", api =>
      api
        .get(/\/v2\/schedules\/.*\/on-calls.*/)
        .reply(200, {
          data: {
            onCallParticipants: [
              { name: "devon@example.com" },
              { name: "jon@example.com" },
            ],
          },
        })
        .get(/\/v2\/schedules\/.*\/next-on-calls.*/)
        .reply(200, {
          data: {
            nextOnCallRecipients: [
              { name: "justin@example.com" },
              { name: "steve@example.com" },
            ],
          },
        })
    )
    .nock("https://slack.com/api", api =>
      api
        .post("/users.lookupByEmail", /email=devon%40example.com/)
        .reply(200, {
          ok: true,
          user: {
            id: "devon",
          },
        })
        .post("/users.lookupByEmail", /email=jon%40example.com/)
        .reply(200, {
          ok: true,
          user: {
            id: "jon",
          },
        })
        .post("/users.lookupByEmail", /email=justin%40example.com/)
        .reply(200, {
          ok: true,
          user: {
            id: "justin",
          },
        })
        .post("/users.lookupByEmail", /email=steve%40example.com/)
        .reply(200, {
          ok: true,
          user: {
            id: "steve",
          },
        })
    )
    .stdout()
    .command(["scheduled:standup-reminder"])
    .it("returns Slack-formatted standup reminder message", ctx => {
      expect(ctx.stdout.trim()).to.eq(
        JSON.stringify({
          attachments: [
            {
              fallback: "Monday Standup",
              color: "#666",
              title: "Monday Standup",
              text:
                "<@devon>, <@jon> based on our on-call schedule, you’ll be running the Monday standup at 12pm ET time. Here are the docs <https://github.com/artsy/README/blob/master/events/open-standup.md|on GitHub>. Add new standup notes <https://www.notion.so/artsy/Standup-Notes-28a5dfe4864645788de1ef936f39687c|in Notion>.",
            },
            {
              fallback: "Next On-call",
              color: "#666",
              title: "Next On-call",
              text:
                "<@justin>, <@steve> looks like you have on-call shifts coming up! Check the schedule in OpsGenie for more details.",
            },
          ],
        })
      )
    })
})
