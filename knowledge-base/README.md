# TradeAssist Knowledge Base

## Structure

```
knowledge-base/
├── roles/                    # Role-specific documents
│   ├── electrician/
│   │   ├── metadata.json     # Role config and document manifest
│   │   ├── regulations/      # Official regulations (BS 7671, Part P, etc.)
│   │   └── guides/           # Best practice guides
│   ├── plumber/
│   │   ├── regulations/
│   │   └── guides/
│   ├── bricklayer/
│   │   ├── regulations/
│   │   └── guides/
│   ├── carpenter/
│   │   ├── regulations/
│   │   └── guides/
│   └── painter/
│       ├── regulations/
│       └── guides/
├── shared/                   # Cross-role documents
│   ├── health-and-safety/    # H&S regulations applicable to all trades
│   └── cdm-regulations/      # Construction Design and Management
└── scripts/                  # Ingestion and sync scripts
```

## Adding Documents

1. Place PDF, DOCX, or TXT files in the appropriate role's `regulations/` or `guides/` directory
2. Update the role's `metadata.json` to reflect the new document
3. Run the sync script to upload to S3 and trigger Bedrock KB re-indexing

## Supported File Types

- PDF (.pdf)
- Plain Text (.txt)
- Word Documents (.docx)

## Document Guidelines

- Use clear, descriptive file names (e.g., `bs-7671-18th-edition-2022.pdf`)
- Ensure documents are text-searchable (not scanned images without OCR)
- Keep documents up-to-date with the latest amendments
- Include the publication date in the filename where possible

## Shared Documents

Documents in the `shared/` directory are included in ALL role knowledge bases. Use this for:
- Health and Safety at Work Act 1974
- CDM Regulations 2015
- PPE Regulations
- Working at Height Regulations
- COSHH Regulations (general)
