import { File, Indent, Text } from "@asyncapi/generator-react-sdk"
import { pascalCase } from "../../../../utils/index"

export default function handlerRender({ asyncapi, params, channelName }) {
    return <File name={`${pascalCase(channelName)}.js`}>
        <Text>
          handler - {channelName}
        </Text>
    </File>
}
