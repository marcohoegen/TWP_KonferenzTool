import fs from "fs";
import path from "path";

const servicesDir = path.resolve("src/api/generate/services");
const hooksDir = path.resolve("src/api/generate/hooks");

if (!fs.existsSync(hooksDir)) {
  fs.mkdirSync(hooksDir, { recursive: true });
}

function upperFirst(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// HTTP-Method-Detection from OpenAPI generated code
function detectHttpMethod(methodBody) {
  if (methodBody.includes("method: 'POST'")) return "POST";
  if (methodBody.includes("method: 'PUT'")) return "PUT";
  if (methodBody.includes("method: 'PATCH'")) return "PATCH";
  if (methodBody.includes("method: 'DELETE'")) return "DELETE";
  if (methodBody.includes("method: 'GET'")) return "GET";
  return "GET"; // default to GET
}

for (const file of fs.readdirSync(servicesDir)) {
  if (!file.endsWith(".ts")) continue;

  const serviceFilePath = path.join(servicesDir, file);
  const content = fs.readFileSync(serviceFilePath, "utf8");

  const serviceName = file.replace(".ts", "");

  // search for methods
  const methodRegex = /public static (\w+)\(([^)]*)\):/g;
  let match;

  let hookExports = [];

  while ((match = methodRegex.exec(content)) !== null) {
    const methodName = match[1];

    // Find the end of this method (next method or end of class)
    const nextMethodMatch = content
      .slice(match.index + 10)
      .search(/public static \w+\(/);
    const methodEnd =
      nextMethodMatch === -1
        ? match.index + 1000
        : match.index + 10 + nextMethodMatch;

    // Extract only this method's body
    const methodBody = content.slice(match.index, methodEnd);

    const httpMethod = detectHttpMethod(methodBody);
    const isMutation = httpMethod !== "GET";

    const hookName = `use${upperFirst(serviceName)}${upperFirst(
      methodName
    )}`.replace("Service", "");

    // invalidateKeys = all queryKeys of this service
    const invalidateKey = `${serviceName}.findAll`;

    if (isMutation) {
      hookExports.push(`
export function ${hookName}(options?: any) {
  return createMutationHook(
    '${serviceName}.${methodName}',
    ${serviceName}.${methodName},
    ['${invalidateKey}']
  )(options);
}
      `);
    } else {
      hookExports.push(`
export function ${hookName}(args?: any, options?: any) {
  return createQueryHook(
    '${serviceName}.${methodName}',
    ${serviceName}.${methodName}
  )(args, options);
}
      `);
    }
  }

  const hookFileContent = `
/* eslint-disable @typescript-eslint/no-unused-vars */

import { createQueryHook, createMutationHook } from '../../hooksFactory';
import { ${serviceName} } from '../services/${serviceName}';

${hookExports.join("\n")}
  `;

  const hookFilePath = path.join(hooksDir, `${serviceName}.hooks.ts`);
  fs.writeFileSync(hookFilePath, hookFileContent, "utf8");
}

console.log("Hooks successfully generated!");
