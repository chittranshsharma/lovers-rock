import React from "react";
import PersonalizedHome from "@/components/PersonalizedHome";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SlugHomePage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return <PersonalizedHome slug={slug} />;
}
