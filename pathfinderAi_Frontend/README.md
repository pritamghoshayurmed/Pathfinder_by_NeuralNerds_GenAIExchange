# PathfinderAI — Resume Builder

>A lightweight client-side resume builder focused on reliable PDF output, fast previews, and professional templates. Built as a React + TypeScript app with an emphasis on a simple data-first flow (Form → HTML → PDF) to avoid brittle LaTeX compilation on the client.



PathfinderAI helps users build professional resumes from structured form data. Users fill the form, pick a template, preview the generated PDF instantly, and download or save resumes. The system generates clean HTML from the resume data and converts it to a high-quality PDF using html2canvas + jsPDF for client-side reliability.

Key goals:
- Produce consistent, printable PDFs without relying on heavy LaTeX toolchains in the browser
- Offer polished, production-ready templates (modern and minimalist shipped)
- Provide a smooth form-driven UX with instant PDF preview and download

## Key features

- Form-driven resume creation (dynamic sections: experience, education, projects, skills)
- Multiple professionally designed templates (Modern, Minimalist — more can be added)
- Instant PDF preview powered by html2canvas + jsPDF
- Save/duplicate/delete resumes in-app
- Clean HTML generation from typed `ResumeData` (avoids fragile LaTeX parsing)

## Architecture & design

- React + TypeScript front-end (Vite)
- Client-side PDF generation: resume data -> HTML -> canvas -> PDF
- Services layer handles template generation and PDF compilation (`src/services`)
- Main editor flow: `src/pages/dashboards/skill-development/ResumeBuilder.tsx`
- Templates and data types: `src/services/latexTemplates.ts` (kept name for backward-compatibility; output is HTML)
- New HTML generator service: `src/services/resumeHtmlGenerator.ts`

Why HTML-first? Browser LaTeX compilation (WASM or external libraries) is brittle, slow, and often fails silently. Generating controlled HTML from our resume data produces predictable, portable PDFs and simplifies previewing and styling.

## Where to look in the codebase

- `src/pages/dashboards/skill-development/ResumeBuilder.tsx` — main page and editor flow
- `src/components/ResumeForm.tsx` — dynamic form controls and resume data model binding
- `src/services/latexTemplates.ts` — template definitions (generateLaTeX still exists for compatibility with templates) and `ResumeData` type
- `src/services/resumeHtmlGenerator.ts` — converts `ResumeData` to clean HTML for each template
- `src/services/latexCompilerService.ts` — PDF generation service (now accepts HTML or LaTeX fallback) using html2canvas + jsPDF
- `src/components/PdfPreview.tsx` — PDF preview renderer (PDF.js canvas-based viewer)

## Development — quick start (Windows cmd.exe)

1. Install dependencies

```
cd pathfinderAi
npm install
```

2. Start dev server (Vite)

```
npm run dev
```

3. Open the site in your browser (Vite will show the local URL)

4. Try the Resume Builder: choose a template, fill the form, click "Compile & Preview", then download the PDF.

Notes:
- The project uses Tailwind CSS, Shadcn UI components, pdfjs-dist, html2canvas and jsPDF.
- If you see empty/blank PDFs, try reloading, and open the browser console for logs from `latexCompilerService` and `resumeHtmlGenerator`.

## Tests & validation

There are no automated tests added yet. Quick manual checks:

- Fill the sample resume data in the builder and compile
- Confirm the PDF preview shows populated data and that the downloaded PDF opens locally

## Next steps / improvements

- Add more templates and fine-tuned print CSS for each template
- Add server-side PDF rendering option (for very complex layouts) as a fallback
- Persist resumes to a backend or cloud storage
- Add automated tests around HTML generation and PDF blob size/content

## Contributing

Contributions are welcome. Please follow the repo's coding conventions. Create feature branches and open pull requests targeting `main`.

## License

See repository license or add one as appropriate.
