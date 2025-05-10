import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { bpmn20Prompt } from './bpmn20Prompt';

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Authless Calculator",
		version: "1.0.0",
	});

	async init() {
		// Tool to generate BPMN 2.0 XML from natural language
		this.server.tool(
			"自然言語で記述された業務プロセスから最適なBPMN2.0のXMLを生成するためのプロンプトテンプレート",
			{ instructions: z.string() },
			async ({ instructions }) => {
				return {
					content: [{ type: "text", text: bpmn20Prompt(instructions) }],
				};
			}
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			// @ts-ignore
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			// @ts-ignore
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
