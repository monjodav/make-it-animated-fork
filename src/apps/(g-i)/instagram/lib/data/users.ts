export type Story = {
  id: string;
  image: string;
  duration: number;
};

export type User = {
  id: string;
  stories: Story[];
};

export const USERS: User[] = [
  {
    id: "1",
    stories: [
      { id: "1", image: "LKO2:N%2Tw=w]~RBVZRi};RPxuwH", duration: 2 },
      { id: "2", image: "LEA]]RrW0}Os%KM{WBxu11Ip|=xZ", duration: 2 },
    ],
  },
  {
    id: "2",
    stories: [
      { id: "1", image: "LEHLh[WB2yk8pyoJadR*.7kCMdnj", duration: 2 },
      { id: "2", image: "LKN]Rv%2Tw=w]~RBVZRi};RPxuwH", duration: 2 },
      { id: "3", image: "LJOXU1-pxuoz~XIoRjWBxsNHfOoJ", duration: 2 },
    ],
  },
  {
    id: "3",
    stories: [
      { id: "1", image: "LWD-8itmofRPKnWCV?kXM}RjkCoz", duration: 2 },
      { id: "2", image: "L25Xx[rV00%#Mw%M%2Mw00x]~qMd", duration: 2 },
    ],
  },
  {
    id: "4",
    stories: [
      { id: "1", image: "L87Luf_JHtDk%yx@eUaOH[WByCx[", duration: 2 },
      { id: "2", image: "LOH]%h^N9^Iq}ts.oLaz=eR*ofxZ", duration: 2 },
    ],
  },
];
