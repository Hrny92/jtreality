import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name:    'jt-reality',
  title:   'JT Reality — Studio',

  projectId: 'y2ccvf93',
  dataset:   'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Obsah')
          .items([
            S.listItem()
              .title('Nemovitosti')
              .child(S.documentTypeList('property').title('Nemovitosti')),
            S.divider(),
            S.listItem()
              .title('AI Chatbot — Mozek')
              .child(
                S.document()
                  .schemaType('chatbotBrain')
                  .documentId('chatbotBrain-singleton')
                  .title('AI Chatbot — Mozek')
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
