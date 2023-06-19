import { File, render } from "@asyncapi/generator-react-sdk";
import { pascalCase } from "../../../../utils/index";

import { Imports, SubscribeRouteHandler, PublishRouteHandler } from '../../../../components/routes/index';

export default function routeHandler({ asyncapi, params, channel, channelName }) {
  return <File name={`${pascalCase(channelName)}.js`}>
    {`
${render(<Imports channelName={channelName} />)}
`}
    {channel.hasPublish() && <PublishRouteHandler channelName={channelName} channel={channel} />}
    {channel.hasSubscribe() && <SubscribeRouteHandler channelName={channelName} channel={channel} />}
  </File>;
}
