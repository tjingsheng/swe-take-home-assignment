import { Card, Center, Group, Image, Stack, Text } from "@mantine/core";

export function Socials() {
  return (
    <Center>
      <Card
        w={{ base: "100%", sm: "80%", md: "60%", lg: "40%" }}
        m="xl"
        withBorder
      >
        <Stack justify="center">
          <Center>
            <Group>
              <a
                href="https://www.tanjingsheng.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="./js-180x180.png"
                  alt="Logo of Jing Sheng"
                  width={40}
                  height={40}
                />
              </a>
              <a
                href="https://github.com/tjingsheng/swe-take-home-assignment"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="./github-dark.png"
                  alt="GitHub"
                  width={40}
                  height={40}
                />
              </a>
            </Group>
          </Center>
          <Text ta="center">
            Welcome to my simple salary tracker app. Click on the GitHub icon to
            find out more!
          </Text>
        </Stack>
      </Card>
    </Center>
  );
}
