'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

// Extend Window to include netlifyIdentity
declare global {
  interface Window {
    netlifyIdentity: {
      on: (event: string, cb: (user?: unknown) => void) => void;
      off: (event: string, cb: (user?: unknown) => void) => void;
    };
  }
}

export default function AdminPage() {
  const isInitialized = useRef(false);
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // After Netlify Identity login, Next.js doesn't reload the page so the CMS
    // never re-initializes. Force a full reload so auth is picked up correctly.
    const handleLogin = () => window.location.reload();

    const attachIdentityListeners = () => {
      if (window.netlifyIdentity) {
        window.netlifyIdentity.on('login', handleLogin);
      }
    };

    // Identity widget may not be ready immediately — poll briefly
    if (window.netlifyIdentity) {
      attachIdentityListeners();
    } else {
      const interval = setInterval(() => {
        if (window.netlifyIdentity) {
          attachIdentityListeners();
          clearInterval(interval);
        }
      }, 100);
      setTimeout(() => clearInterval(interval), 5000);
    }

    // Import decap-cms-app lazily without blocking the main thread.
    // We use a setTimeout(0) to yield to the browser first so the page
    // can paint the loading indicator before the large bundle is parsed.
    setTimeout(() => {
      import('decap-cms-app').then(({ default: CMS }) => {
        CMS.init({
          config: {
            backend: {
              name: 'git-gateway',
              branch: 'main',
            },
            local_backend: false,
            load_config_file: false,
            show_preview_links: false,
            editor: { preview: false },
            media_folder: '/public/images',
            public_folder: '/images',
            collections: [
              {
                name: 'showcase',
                label: 'Showcase Page',
                files: [
                  {
                    file: 'content/showcase/showcase.md',
                    label: 'Project Showcase',
                    name: 'showcase',
                    fields: [
                      { label: 'Showcase Description', name: 'showcase_description', widget: 'text' },
                      { label: 'Showcase Date', name: 'date', widget: 'datetime' },
                      { label: 'Showcase Location', name: 'location', widget: 'string' },
                      { label: 'Winner Blurb', name: 'winner_blurb', widget: 'text' },
                      { label: 'Location Google Map Embed Link', name: 'location_link', widget: 'string' },
                      { label: 'Location Image', name: 'location_image', widget: 'image', public_folder: '/' },
                      {
                        label: 'FAQs', name: 'faqs', widget: 'list', min: 3,
                        fields: [
                          { label: 'Question', name: 'question', widget: 'string' },
                          { label: 'Answer', name: 'answer', widget: 'string' },
                        ],
                      },
                      {
                        label: 'Sponsors', name: 'sponsors', widget: 'list',
                        field: { label: 'Sponsor Logo', name: 'logo', widget: 'image' },
                      },
                    ],
                  },
                ],
              },
              {
                name: 'homepage',
                label: 'Home Page',
                files: [
                  {
                    file: 'content/home/homepage.md',
                    label: 'Home Page Content',
                    name: 'homepage',
                    fields: [
                      { label: 'About Subtitle', name: 'about_subtitle', widget: 'string', hint: "Heading under 'What is HKN Projects?'" },
                      { label: 'About Body', name: 'about_body', widget: 'text', hint: 'Paragraph text under the subtitle' },
                      {
                        label: 'Slideshow Images',
                        name: 'slideshow_images',
                        widget: 'list',
                        hint: 'Images displayed in the rotating hero slideshow on the home page and showcase page',
                        field: { label: 'Image', name: 'image', widget: 'image', media_folder: '/public/images/slideshow', public_folder: '/images/slideshow' },
                      },
                      {
                        label: 'Featured Projects',
                        name: 'featured_projects',
                        widget: 'list',
                        field: {
                          label: 'Project',
                          name: 'project',
                          widget: 'relation',
                          collection: 'projects',
                          search_fields: ['title'],
                          value_field: '{{slug}}',
                          display_fields: ['title'],
                        },
                      },
                    ],
                  },
                ],
              },
              {
                name: 'resources',
                label: 'Resources Page',
                files: [
                  {
                    file: 'content/resources/resources.md',
                    label: 'Resources Page',
                    name: 'resources',
                    fields: [
                      {
                        label: 'Resource Categories', name: 'resource_categories', widget: 'list',
                        fields: [
                          { label: 'Category Title', name: 'title', widget: 'string' },
                          {
                            label: 'Links', name: 'links', widget: 'list',
                            fields: [
                              { label: 'Label', name: 'label', widget: 'string' },
                              { label: 'URL', name: 'url', widget: 'string' },
                              { label: 'Description', name: 'description', widget: 'string', required: false },
                            ],
                          },
                        ],
                      },
                      { label: 'Contact Email', name: 'contact_email', widget: 'string' },
                      { label: 'Contact LinkedIn', name: 'contact_linkedin', widget: 'string' },
                      { label: 'Contact Instagram', name: 'contact_instagram', widget: 'string' },
                    ],
                  },
                ],
              },
              {
                name: 'projects',
                label: 'Projects',
                folder: 'content/projects',
                create: true,
                slug: '{{slug}}',
                path: '{{slug}}/index',
                media_folder: '',
                public_folder: '',
                fields: [
                  { label: 'Project Title', name: 'title', widget: 'string' },
                  { label: 'Detailed Description', name: 'body', widget: 'text' },
                  { label: 'Documentation Link', name: 'doc_link', widget: 'string', hint: "URL to the project's documentation page (shown above the image carousel)", required: false },
                  { label: 'Team Leader', name: 'team_leader', widget: 'string', hint: 'Full name of the team leader (first and last name)', required: false },
                  { label: 'Team Members', name: 'team', widget: 'list', field: { label: 'Member Name', name: 'member', widget: 'string', hint: 'Enter first and last name' } },
                  { label: 'Project Start Date', name: 'start_date', widget: 'datetime', date_format: true },
                  { label: 'Project End Date', name: 'end_date', widget: 'datetime', date_format: true, required: false, hint: 'Leave blank if the project is still active' },
                  { label: 'Project Type', name: 'type', widget: 'string', hint: 'e.g. Computer Science, Data Science, Electrical, Mechanical — or enter a custom type' },
                  { label: 'Featured on Home Page', name: 'featured', widget: 'boolean', default: false, hint: 'Toggle on to include this project in the home page featured carousel' },
                  { label: 'Team Photo', name: 'team_photo', widget: 'image', media_folder: '/public/images/projects', public_folder: '/images/projects', hint: 'Group photo displayed in the Project Members section', required: false },
                  { label: 'Preview Image', name: 'preview_image', widget: 'image', media_folder: '/public/images/projects', public_folder: '/images/projects', hint: 'Thumbnail shown on the projects listing page' },
                  {
                    label: 'Carousel Images',
                    name: 'carousel_images',
                    widget: 'list',
                    hint: 'Add as many documentation/project images as you want — these will appear in the carousel slideshow',
                    field: { label: 'Image', name: 'image', widget: 'image', media_folder: '/public/images/projects', public_folder: '/images/projects' },
                  },
                  { label: 'Status', name: 'status', widget: 'select', options: ['active', 'past'] },
                  { label: 'Winner Status', name: 'winner_status', widget: 'select', options: ['winner', 'not winner'] },
                  { label: 'Keywords', name: 'keywords', widget: 'list' },
                ],
              },
            ],
          },
        });

        setStatus('ready');
      }).catch((err) => {
        console.error('Failed to load CMS:', err);
      });
    }, 0);

    return () => {
      if (window.netlifyIdentity) {
        window.netlifyIdentity.off('login', handleLogin);
      }
      // Clear the CMS mount point so it can be re-initialized cleanly
      const root = document.getElementById('nc-root');
      if (root) {
        root.innerHTML = '';
      }
      isInitialized.current = false;
    };
  }, []);

  return (
    <>
      <Script
        src="https://identity.netlify.com/v1/netlify-identity-widget.js"
        strategy="beforeInteractive"
      />
      <style jsx global>{`
        .nextjs-error-overlay,
        [class*="error-overlay"],
        nextjs-portal {
          display: none !important;
          visibility: hidden !important;
        }

        #nc-root {
          height: 100vh;
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        #nc-root > div > div > div:nth-child(2) {
          height: calc(100vh - 80px) !important;
          overflow-y: auto !important;
          padding-bottom: 40px !important;
        }

        #nc-root .cms-top-bar,
        #nc-root > div > div > div:first-child {
          height: 60px !important;
        }
      `}</style>

      {/* Loading overlay shown while the CMS bundle is being parsed.
          This prevents the page from appearing frozen with no feedback. */}
      {status === 'loading' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1a2e',
          color: '#bfdbfe',
          fontFamily: 'Georgia, serif',
          gap: '16px',
          zIndex: 9999,
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(96,165,250,0.3)',
            borderTopColor: '#60a5fa',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ fontSize: '18px', opacity: 0.8 }}>Loading Admin CMS…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <div id="nc-root" />
    </>
  );
}