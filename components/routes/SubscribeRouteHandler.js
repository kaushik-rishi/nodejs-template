import { toHermesTopic, camelCase } from "../../utils/index";
import { Text, render } from "@asyncapi/generator-react-sdk";

function ValidateMessageAgainstPayloadSubscribe({ channel, channelName }) {
    let validationLogic = '';

    if (channel.subscribe().hasMultipleMessages()) {
        validationLogic = `
      let nValidated = 0;
      // For oneOf, only one message schema should match.
      // Validate payload against each message and count those which validate
      `;

        for (let i = 0; i < channel.subscribe().messages().length; ++i) {
            validationLogic += `
        try {
          nValidated = await validateMessage(message.payload,'${channelName}','${channel.subscribe().message(i).name()}','publish', nValidated);
        } catch { };
        `;
        }

        validationLogic = validationLogic + `
      if (nValidated === 1) {
        await ${camelCase(channelName)}}Handler.${channel.subscribe().id()}({message});
        next()
      } else {
        throw new Error(\`\${nValidated} of ${channel.subscribe().messages().length} message schemas matched when exactly 1 should match\`);
      }
      `;
    } else {
        validationLogic = `
      await validateMessage(message.payload,'${channelName}','${channel.subscribe().message().name()}','publish');
      await ${camelCase(channelName)}Handler.${channel.subscribe().id()}({message});
      next();
      `
    }

    return <Text>
        {validationLogic}
    </Text>
}

export function SubscribeRouteHandler({ channel, channelName }) {
    let subscribeRouteSummary = '';
    if (channel.subscribe().summary()) {
        subscribeRouteSummary = `/**
   * ${channel.subscribe().summary()}
   */`
    }

    return <Text>
        {`
    router.useOutbound('${toHermesTopic(channelName)}', async (message, next) => {
      try {
        ${render(<ValidateMessageAgainstPayloadSubscribe channel={channel} channelName={channelName} />)}
      } catch (e) {
        next(e);
      }
    });
    `}
    </Text>

}
