interface OpsGenieUser {
  username: string
  fullName: string
}

interface OpsGenieTeamMember {
  user: OpsGenieUser
}

interface OpsGenieTeamResponse {
  data: {
    members: [OpsGenieTeamMember]
  }
}

interface OpsGenieUserResponse {
  data: OpsGenieUser
}

interface OpsGenieUsersResponse {
  data: OpsGenieUser[]
}

interface OpsGenieOnCallsResponse {
  data: {
    onCallParticipants: String[]
  }
}
