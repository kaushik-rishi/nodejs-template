import { camelCase, toHermesTopic } from "../../utils/index";
import { Text, render } from "@asyncapi/generator-react-sdk";

function ValidateMessageAgainstPayloadPublish({ channel, channelName }) {
    let validationLogic = '';

    if (channel.publish().hasMultipleMessages()) {
        validationLogic = `
      /*
      * TODO: If https://github.com/asyncapi/parser-js/issues/372 is addressed, simplify this
      * code to just validate the message against the combined message schema which will
      * include the \`oneOf\` in the JSON schema - let the JSON schema validator handle the
      * oneOf semantics (rather than each generator having to emit conditional code)
      */
      let nValidated = 0;
      // For oneOf, only one message schema should match.
      // Validate payload against each message and count those which validate
      `;

        for (let i = 0; i < channel.publish().messages().length; ++i) {
            validationLogic += `
        try {
          nValidated = await validateMessage(message.payload,'${channelName}','${channel.publish().message(i).name()}','publish', nValidated);
        } catch { };
        `;
        }

        validationLogic = validationLogic + `
      if (nValidated === 1) {
        await ${camelCase(channelName)}}Handler.${channel.publish().id()}({message});
        next()
      } else {
        throw new Error(\`\${nValidated} of ${channel.publish().messages().length} message schemas matched when exactly 1 should match\`);
      }
      `;
    } else {
        validationLogic = `
      await validateMessage(message.payload,'${channelName}','${channel.publish().message().name()}','publish');
      await ${camelCase(channelName)}Handler.${channel.publish().id()}({message});
      next();
      `
    }

    return <Text>
        {validationLogic}
    </Text>
}

export function PublishRouteHandler({ channel, channelName }) {
    let publishRouteSummary = '';
    if (channel.publish().summary()) {
        publishRouteSummary = `/**
   * ${channel.publish().summary()}
   */`
    }

    return <Text>
        {`
    router.use('${toHermesTopic(channelName)}', async (message, next) => {
      try {
        ${render(<ValidateMessageAgainstPayloadPublish channel={channel} channelName={channelName} />)}
      } catch (e) {
        next(e);
      }
    });
    `}
    </Text>
}
