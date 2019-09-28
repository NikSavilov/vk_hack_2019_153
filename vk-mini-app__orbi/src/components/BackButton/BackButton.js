import { HeaderButton, IOS, platform } from "@vkontakte/vkui";
import React from "react";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import Icon24Back from "@vkontakte/icons/dist/24/back";

const osName = platform();

export const BackButton = ({ onClick, to }) => {
  return (
    <HeaderButton onClick={onClick} data-to={to}>
      {osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
    </HeaderButton>
  );
};
