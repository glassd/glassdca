import { client } from "../../lib/sanity";
import type { Route } from "./+types/projects";

export async function loader({ request }: Route.LoaderArgs) {
  // Simplified query - no ordering, just get all projects
  const query = `*[_type == "project"] {
    _id,
    title,
    slug,
    mainImage,
    description,
    liveUrl,
    githubUrl,
    publishedAt
  }`;

  try {
    console.log("Fetching projects from Sanity...");
    const projects = await client.fetch(query);
    console.log("Projects fetched:", JSON.stringify(projects, null, 2));
    return Response.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return Response.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
