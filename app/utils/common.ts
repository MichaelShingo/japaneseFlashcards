import { Session } from "next-auth";
import { NextRequest } from "next/server";
export type ValueLabel = {
  value: string;
  label: string;
};

export type Order = 'asc' | 'desc';


// node_modules/next-auth/src/lib/index.ts
export interface NextAuthRequest extends NextRequest {
  auth: Session | null;
}
