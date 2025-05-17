# 🌐 Telgea MVNO Integration

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-19+-green.svg)](https://nodejs.org/)

> 📱 A modern, TypeScript-based integration layer between MVNO provider APIs and Telgea's internal systems

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [Development](#-development)
---

## 🔍 Overview

This project seamlessly integrates data from a new Mobile Virtual Network Operator (MVNO) partner into Telgea's internal systems. It transforms both SOAP and REST API responses into a standardized format that can be consumed by Telgea's API normalizer.


---

## ✨ Features

- 🔄 **Bi-directional Conversion** - Transform data between MVNO formats and Telgea's internal structure
- 🛡️ **Type Safety** - Comprehensive TypeScript interfaces for all data structures
- 🧩 **Modular Design** - Separate converters with clear responsibilities
- 🚨 **Error Handling** - Robust error capture with actionable messages
- 🔌 **Extensibility** - Easy to add new providers

---

## 🏗️ Architecture

The integration follows an **adapter pattern** with these key components:

### Project Structure

```
telgea-mvno-integration/
├── 📁 src/
│   ├── 📁 converters/        # Data transformation logic
│   ├── 📁 interfaces/            # Type definitions
│   ├── 📁 services/          # Business logic
│   ├── 📁 utils/             # Helper functions
│   └── 📄 index.ts           # Entry point
├── 📁 tests/                 # Test files
├── 📁 docs/                  # Documentation
├── 📄 package.json
├── 📄 tsconfig.json
└── 📄 README.md
```

### Data Flow

<div align="center">
  
```
┌────────────┐     ┌─────────────┐     ┌────────────────┐     ┌─────────────┐
│ MVNO APIs  │────►│  Converters  │────►│  Integration   │────►│   Telgea    │
│ SOAP/REST  │     │              │     │    Service     │     │   Systems   │
└────────────┘     └─────────────┘     └────────────────┘     └─────────────┘
```

</div>

---

## 📥 Installation

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/moise10r/telgea-mvno-integration
cd telgea-mvno-integration
```

```bash
# Install dependencies
npm install
```


### Running the project

```bash
npm start
```

This generates dist folder and executes in `dist/index.js` showing sample data conversions.

---


### Core Components

#### `SoapConverter`

Transforms SOAP XML responses into the internal format.

```typescript
// Convert a single SOAP response
const normalizedData = soapConverter.convertChargeSmsToNormalizedFormat(soapResponse);

// Process multiple SOAP responses
const batchData = soapConverter.batchConvert([response1, response2]);
```

#### `RestConverter`

Transforms REST JSON responses into the internal format.

```typescript
// Convert usage data from REST
const normalizedData = restConverter.convertUsageToNormalizedFormat(restResponse);

```

#### `MvnoIntegrationService`

Orchestrates the conversion process.

```typescript
// Process and combine data from multiple sources
const userData = mvnoIntegrationService.processUserData(soapResponse, restResponse);
```

---

## 👨‍💻 Development

### Adding a New MVNO Provider

1. Update type definitions in `interfaces`
2. Create or modify converters in the `converters/` directory
3. Update the integration service
4. Add tests for the new integration

### Running Tests

```bash
npm test
```

---
