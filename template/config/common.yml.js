import { File, Indent, Text } from "@asyncapi/generator-react-sdk"

export default function ({ asyncapi, params }) {
    return <File name="common.yml">
{`default:
  app:
    name: {{ asyncapi.info().title() }}
    version: {{ asyncapi.info().version() }}
{% if asyncapi.server(params.server).protocol() === "ws" %}
  ws:
    port: {{ asyncapi.server(params.server).url() | replaceServerVariablesWithValues(asyncapi.server(params.server).variables()) | port(80) }}
    path: /ws
    topicSeparator: '__'
{% endif %}
{%- if asyncapi.server(params.server).protocol() !== "ws" %}
  broker:
{%- endif %}
{%- if asyncapi.server(params.server).protocol() === "amqp" %}
    amqp:
      exchange:
      username:
      password:
      host: {{ asyncapi.server(params.server).url() |  replaceServerVariablesWithValues(asyncapi.server(params.server).variables())  | host }}
      port:
      topics: {{ asyncapi | channelNamesWithPublish | toAmqpTopic | dump | safe }}
      queue: {{ asyncapi.info().title() | queueName(asyncapi.info().version()) }}
      queueOptions:
        exclusive: false
        durable: true
        autoDelete: true
{%- endif %}
{%- if asyncapi.server(params.server).protocol() === "mqtt" or asyncapi.server(params.server).protocol() === "mqtts"%}
    mqtt:
      url: {{ asyncapi.server(params.server).protocol() }}://{{ asyncapi.server(params.server).url() |  replaceServerVariablesWithValues(asyncapi.server(params.server).variables()) | stripProtocol  }}
      topics: {{ asyncapi | channelNamesWithPublish | toMqttTopic | dump | safe }}
      qos:
      protocol: mqtt
      retain:
      subscribe: true
{%- endif %}
{%- if asyncapi.server(params.server).protocol() === "kafka" or asyncapi.server(params.server).protocol() === "kafka-secure" %}
    kafka:
      clientId: {{ asyncapi.info().title() | camelCase }}
      brokers:
        - {{ asyncapi.server(params.server).url() |  replaceServerVariablesWithValues(asyncapi.server(params.server).variables()) | stripProtocol }}
      consumerOptions:
        groupId: {{ asyncapi.info().title() | camelCase }}
      topics:
      {%- for topic in asyncapi | channelNamesWithPublish %}
        - {{ topic | toKafkaTopic }}
      {%- endfor %}
      topicSeparator: '__'
      topicPrefix:
{%- endif %}

development:

test:

staging:

production:
{%- if asyncapi.server(params.server).protocol() === "kafka" or asyncapi.server(params.server).protocol() === "kafka-secure"%}
  broker:
    kafka:
      ssl:
        rejectUnauthorized: true
{%- if params.securityScheme and asyncapi.components().securityScheme(params.securityScheme).type() !== 'X509' %}
      sasl:
        mechanism: 'plain'
        username:
        password:
{%- endif %}
{%- endif %}`}
    </File>
}

// default:
//   app:
//     name: {{ asyncapi.info().title() }}
//     version: {{ asyncapi.info().version() }}
// {% if asyncapi.server(params.server).protocol() === "ws" %}
//   ws:
//     port: {{ asyncapi.server(params.server).url() | replaceServerVariablesWithValues(asyncapi.server(params.server).variables()) | port(80) }}
//     path: /ws
//     topicSeparator: '__'
// {% endif %}
// {%- if asyncapi.server(params.server).protocol() !== "ws" %}
//   broker:
// {%- endif %}
// {%- if asyncapi.server(params.server).protocol() === "amqp" %}
//     amqp:
//       exchange:
//       username:
//       password:
//       host: {{ asyncapi.server(params.server).url() |  replaceServerVariablesWithValues(asyncapi.server(params.server).variables())  | host }}
//       port:
//       topics: {{ asyncapi | channelNamesWithPublish | toAmqpTopic | dump | safe }}
//       queue: {{ asyncapi.info().title() | queueName(asyncapi.info().version()) }}
//       queueOptions:
//         exclusive: false
//         durable: true
//         autoDelete: true
// {%- endif %}
// {%- if asyncapi.server(params.server).protocol() === "mqtt" or asyncapi.server(params.server).protocol() === "mqtts"%}
//     mqtt:
//       url: {{ asyncapi.server(params.server).protocol() }}://{{ asyncapi.server(params.server).url() |  replaceServerVariablesWithValues(asyncapi.server(params.server).variables()) | stripProtocol  }}
//       topics: {{ asyncapi | channelNamesWithPublish | toMqttTopic | dump | safe }}
//       qos:
//       protocol: mqtt
//       retain:
//       subscribe: true
// {%- endif %}
// {%- if asyncapi.server(params.server).protocol() === "kafka" or asyncapi.server(params.server).protocol() === "kafka-secure" %}
//     kafka:
//       clientId: {{ asyncapi.info().title() | camelCase }}
//       brokers:
//         - {{ asyncapi.server(params.server).url() |  replaceServerVariablesWithValues(asyncapi.server(params.server).variables()) | stripProtocol }}
//       consumerOptions:
//         groupId: {{ asyncapi.info().title() | camelCase }}
//       topics:
//       {%- for topic in asyncapi | channelNamesWithPublish %}
//         - {{ topic | toKafkaTopic }}
//       {%- endfor %}
//       topicSeparator: '__'
//       topicPrefix:
// {%- endif %}

// development:

// test:

// staging:

// production:
// {%- if asyncapi.server(params.server).protocol() === "kafka" or asyncapi.server(params.server).protocol() === "kafka-secure"%}
//   broker:
//     kafka:
//       ssl:
//         rejectUnauthorized: true
// {%- if params.securityScheme and asyncapi.components().securityScheme(params.securityScheme).type() !== 'X509' %}
//       sasl:
//         mechanism: 'plain'
//         username:
//         password:
// {%- endif %}
// {%- endif %}
