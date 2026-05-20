---
title: Projects Portal
team_leader: Jett Ngo
team:
  - Akari Oh
  - Aman Palanti
  - Annie Yang
  - Benjamin Signer
  - Lina Seto
  - Saravanan Valliappan
start_date: 2026-02-07
type: Computer Science
featured: true
preview_image: /images/projects/projects_portal_image1.png
carousel_images:
  - /images/projects/projects_portal_image2.png
  - /images/projects/projects_portal_image3.png
  - /images/projects/projects_portal_image4.png
  - /images/projects/projects_portal_image5.png
  - /images/projects/projects_portal_image6.png
  - /images/projects/projects_portal_image7.png
  - /images/projects/projects_portal_image8.png
  - /images/projects/projects_portal_image9.png
  - /images/projects/projects_portal_image10.png
status: active
winner_status: not winner
keywords:
  - website
  - webdev
  - computerscience
  - cs
---
The HKN UCSD Projects Portal is a Next.js web application deployed on Netlify that serves as a public-facing hub for the HKN (Eta Kappa Nu) Projects branch at UCSD. It has several key components:

The website has a homepage, a projects listing page, individual project detail pages, a showcase event page, and a resources page. Content is managed through Decap CMS at `/admin`, which allows non-technical team members to add/edit projects and page content via a GitHub-backed CMS that commits markdown files directly to the repo.

The AI chatbot ("Ramsey") is an embedded chat widget that answers questions about HKN — its mission, projects, events, membership, and the Hard Hack competition. It supports multiple LLM providers (Claude, Gemini, OpenAI) switchable via an environment variable. It uses RAG (Retrieval-Augmented Generation) — meaning it queries a Pinecone vector database populated with project content and website text to give grounded, accurate answers rather than hallucinating.

The RAG pipeline consists of a Netlify build plugin that automatically re-indexes Pinecone after every deploy (pulling project markdown from GitHub), and a one-time indexing script that seeds the database with broader content including website pages and Google Drive documents.
