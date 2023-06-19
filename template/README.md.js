import { File, Text } from "@asyncapi/generator-react-sdk"

export default function readmeFile({ asyncapi, params }) {
  const isX509SecurityScheme = (params.securityScheme) &&
        (asyncapi.server(params.server).protocol() === 'kafka' ||
         asyncapi.server(params.server).protocol() === 'kafka-secure') &&
        (asyncapi.components().securityScheme(params.securityScheme).type() === 'X509')

  return <File name="README.md">
    <Text>{`# ${ asyncapi.info().title() }

${ asyncapi.info().description() }

## Running the server

1. Install dependencies
    \`\`\`sh
    npm i
    \`\`\`
`}
    </Text>

    {isX509SecurityScheme &&
      <Text>
        1. (Optional) For X509 security provide files with all data required to establish secure connection using certificates. Place files like `ca.pem`, `service.cert`, `service.key` in the root of the project or the location that you explicitly specified during generation.
      </Text>
    }

    <Text>
{`1. Start the server with default configuration
    \`\`\`sh
    npm start
    \`\`\`
1. (Optional) Start server with secure production configuration
    \`\`\`sh
    NODE_ENV=production npm start
    \`\`\`

> NODE_ENV=production relates to \`config/common.yml\` that contains different configurations for different environments. Starting server without \`NODE_ENV\` applies default configuration while starting the server as \`NODE_ENV=production npm start\` applies default configuration supplemented by configuration settings called \`production\`.
`}
    </Text>
  </File>
}
