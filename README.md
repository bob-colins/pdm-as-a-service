# PdM-as-a-Service MCP Server

プロダクトマネージャーの生産性をちょこっと底上げするプロンプトを提供するMCPサーバー

## Tools
1. `bpmn20_prompt`
    * 自然言語で記述された業務プロセスから最適なBPMN2.0のXMLを生成するためのプロンプトテンプレート
2. `definition_of_done_prompt`
    * ユーザーストーリーと受け入れ基準を実装可能なレベルまでブラッシュアップするためのプロンプトテンプレート

## Installation

```json
{
  "mcpServers": {
    "pdm-as-a-service": {
      "url": "https://pdm-as-a-service.kosuke-sakai.workers.dev/sse"
    }
  }
}
```