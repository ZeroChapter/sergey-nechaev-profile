export type Skill = {
  id: string;
  name: string;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
};

export type Project = {
  id: string;
  name: string;
  summary: string | null;
  url: string | null;
  repoUrl: string[];
  skills: Skill[];
};

export type Profile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  github: string | null;
  blog: string | null;
  avatarUrl: string | null;
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
};

const PROFILE_QUERY = `
  query Profile {
    profile {
      id
      name
      email
      phone
      github
      blog
      avatarUrl
      experiences {
        id
        company
        role
        startDate
        endDate
        description
      }
      projects {
        id
        name
        summary
        url
        repoUrl
        skills {
          id
          name
        }
      }
      skills {
        id
        name
      }
    }
  }
`;

type GraphQlResponse = {
  data?: { profile: Profile | null };
  errors?: { message: string }[];
};

export async function fetchProfile(signal?: AbortSignal): Promise<Profile | null> {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: PROFILE_QUERY }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status}`);
  }

  const payload = (await response.json()) as GraphQlResponse;

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join('; '));
  }

  return payload.data?.profile ?? null;
}
