import puppeteer from 'puppeteer';
import { Personal, SkillCategory, Experience, Project, Education } from '@/types';

export async function generatePdf(
  personal: Personal | null,
  skills: SkillCategory[],
  experiences: Experience[],
  projects: Project[],
  educations: Education[],
  t: (key: string) => string,
  language: string
): Promise<Buffer> {
  const isRtl = language === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';
  const align = isRtl ? 'right' : 'left';
  const fontFamily = isRtl ? 'Arial, sans-serif' : 'Helvetica, Arial, sans-serif';

  const html = `
    <!DOCTYPE html>
    <html lang="${language}" dir="${dir}">
    <head>
      <meta charset="UTF-8">
      <style>
        @page { margin: 2cm; size: A4; }
        body {
          font-family: ${fontFamily};
          line-height: 1.5;
          color: #333;
          max-width: 210mm;
          margin: 0 auto;
        }
        h1, h2, h3 { color: #000; margin-top: 0; }
        h1 { font-size: 24pt; margin-bottom: 5px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        h2 { font-size: 16pt; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; }
        .header { text-align: ${align}; margin-bottom: 30px; }
        .contact-info { font-size: 10pt; margin-bottom: 5px; }
        .section { margin-bottom: 20px; text-align: ${align}; }
        .item { margin-bottom: 15px; }
        .item-header { display: flex; justify-content: space-between; align-items: baseline; }
        .item-title { font-weight: bold; font-size: 11pt; }
        .item-subtitle { font-style: italic; font-size: 10pt; }
        .item-date { font-size: 10pt; color: #666; }
        .skills-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .skill-category { font-weight: bold; margin-bottom: 5px; }
        .skill-list { font-size: 10pt; }
        ul { margin-top: 5px; padding-${isRtl ? 'right' : 'left'}: 20px; }
        li { margin-bottom: 2px; font-size: 10pt; }
        a { color: #0066cc; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${personal?.name || ''}</h1>
        <div class="contact-info">
          ${personal?.email ? `<span>${personal.email}</span>` : ''}
          ${personal?.phone ? ` • <span>${personal.phone}</span>` : ''}
          ${personal?.location ? ` • <span>${personal.location}</span>` : ''}
        </div>
        <div class="contact-info">
          ${personal?.website ? `<a href="${personal.website}">${personal.website}</a>` : ''}
          ${personal?.github ? ` • <a href="${personal.github}">${personal.github}</a>` : ''}
          ${personal?.linkedin ? ` • <a href="${personal.linkedin}">${personal.linkedin}</a>` : ''}
        </div>
      </div>

      <div class="section">
        <h2>${t('resume.summary')}</h2>
        <p>${personal?.summary || ''}</p>
      </div>

      <div class="section">
        <h2>${t('skills.title')}</h2>
        <div class="skills-grid">
          ${skills.map(cat => `
            <div class="item">
              <div class="skill-category">${cat.category}</div>
              <div class="skill-list">
                ${cat.items.map(s => `${s.name}`).join(', ')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="section">
        <h2>${t('experiences.title')}</h2>
        ${experiences.map(exp => `
          <div class="item">
            <div class="item-header">
              <span class="item-title">${exp.role}</span>
              <span class="item-date">${exp.period}</span>
            </div>
            <div class="item-subtitle">${exp.company} • ${exp.location}</div>
            <ul>
              ${exp.projects.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <h2>${t('projects.title')}</h2>
        ${projects.map(proj => `
          <div class="item">
            <div class="item-header">
              <span class="item-title">${proj.title}</span>
              ${proj.technologies ? `<span class="item-date">${proj.technologies.join(', ')}</span>` : ''}
            </div>
            <p>${proj.personalExperience || proj.description || ''}</p>
            <div class="contact-info">
              ${proj.liveUrl ? `<a href="${proj.liveUrl}">Live Demo</a>` : ''}
              ${proj.githubUrl ? `${proj.liveUrl ? ' • ' : ''}<a href="${proj.githubUrl}">GitHub</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <h2>${t('educations.title')}</h2>
        ${educations.map(edu => `
          <div class="item">
            <div class="item-header">
              <span class="item-title">${edu.degree}</span>
              <span class="item-date">${edu.startYear} - ${edu.endYear}</span>
            </div>
            <div class="item-subtitle">${edu.institution}</div>
          </div>
        `).join('')}
      </div>
    </body>
    </html>
  `;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  return Buffer.from(pdfBuffer);
}
