import FakeVideo from "@/assets/videos/fake-video.mp4";

export type Story = {
  id: string;
  source: string;
  blurhash: string;
};

export type User = {
  id: string;
  stories: Story[];
};

export const USERS: User[] = [
  {
    id: "1",
    stories: [
      { id: "1", source: FakeVideo, blurhash: "LKO2:N%2Tw=w]~RBVZRi};RPxuwH" },
      { id: "2", source: FakeVideo, blurhash: "LEA]]RrW0}Os%KM{WBxu11Ip|=xZ" },
      { id: "3", source: FakeVideo, blurhash: "LJOXU1-pxuoz~XIoRjWBxsNHfOoJ" },
    ],
  },
  {
    id: "2",
    stories: [
      { id: "1", source: FakeVideo, blurhash: "LOH]%h^N9^Iq}ts.oLaz=eR*ofxZ" },
      { id: "2", source: FakeVideo, blurhash: "LEHLh[WB2yk8pyoJadR*.7kCMdnj" },
    ],
  },
  {
    id: "3",
    stories: [
      { id: "1", source: FakeVideo, blurhash: "LWD-8itmofRPKnWCV?kXM}RjkCoz" },
      { id: "2", source: FakeVideo, blurhash: "LJOXU1-pxuoz~XIoRjWBxsNHfOoJ" },
      { id: "3", source: FakeVideo, blurhash: "L25Xx[rV00%#Mw%M%2Mw00x]~qMd" },
    ],
  },
  {
    id: "4",
    stories: [
      { id: "1", source: FakeVideo, blurhash: "L87Luf_JHtDk%yx@eUaOH[WByCx[" },
      { id: "2", source: FakeVideo, blurhash: "LOH]%h^N9^Iq}ts.oLaz=eR*ofxZ" },
    ],
  },
];
