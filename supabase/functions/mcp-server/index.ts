import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Simple MCP-like server over HTTP
export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const body = await req.json();
  const { jsonrpc, id, method, params } = body;

  if (jsonrpc !== '2.0') {
    return new Response(JSON.stringify({ jsonrpc: '2.0', error: { code: -32600, message: 'Invalid Request' }, id }), {
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    let result;
    switch (method) {
      case 'initialize':
        result = {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: { listChanged: true },
          },
          serverInfo: {
            name: 'vyapaaro-mcp-server',
            version: '1.0.0',
          },
        };
        break;

      case 'tools/list':
        result = {
          tools: [
            {
              name: 'get_shops',
              description: 'Get a list of shops',
              inputSchema: {
                type: 'object',
                properties: {},
              },
            },
            {
              name: 'get_products',
              description: 'Get a list of products',
              inputSchema: {
                type: 'object',
                properties: {
                  shop_id: { type: 'string', description: 'Optional shop ID to filter products' },
                },
              },
            },
          ],
        };
        break;

      case 'tools/call':
        const { name, arguments: args } = params;
        switch (name) {
          case 'get_shops':
            const { data: shops, error: shopsError } = await supabase.from('shops').select('*');
            if (shopsError) throw new Error(shopsError.message);
            result = {
              content: [{ type: 'text', text: JSON.stringify(shops) }],
            };
            break;

          case 'get_products':
            let query = supabase.from('products').select('*');
            if (args?.shop_id) {
              query = query.eq('shop_id', args.shop_id);
            }
            const { data: products, error: productsError } = await query;
            if (productsError) throw new Error(productsError.message);
            result = {
              content: [{ type: 'text', text: JSON.stringify(products) }],
            };
            break;

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
        break;

      default:
        throw new Error(`Unknown method: ${method}`);
    }

    return new Response(JSON.stringify({ jsonrpc: '2.0', result, id }), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ jsonrpc: '2.0', error: { code: -32603, message: error.message }, id }), {
      headers: { 'content-type': 'application/json' },
    });
  }
};