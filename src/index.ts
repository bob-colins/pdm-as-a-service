import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { bpmn20Prompt } from './bpmn20Prompt';
import { definitionOfDonePrompt } from './definitionOfDonePrompt';

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Authless Calculator",
		version: "1.0.0",
	},
    {
        capabilities: {
            //MCPクライアントでpromptが普及したら、そちらに切り替える
            tools: {},
        },
    });

	async init() {
		// Tool to generate BPMN 2.0 XML from natural language
		this.server.tool(
			"bpmn20_prompt",
			"自然言語で記述された業務プロセスから最適なBPMN2.0のXMLを生成するためのプロンプトテンプレート",
			{ instructions: z.string() },
			async ({ instructions }) => ({
				content: [{ type: "text", text: bpmn20Prompt(instructions) }],
			})
		);
		this.server.tool(
			"definition_of_done_prompt",
			"ユーザーストーリーと受け入れ基準を実装可能なレベルまでブラッシュアップするためのプロンプトテンプレート",
			{ instructions: z.string() },
			async ({ instructions }) => ({
				content: [{ type: "text", text: definitionOfDonePrompt(instructions) }],
			})
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
