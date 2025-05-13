type Renderer = (artifacts: string[], bundles: string[], version: string) => string

export const gradleGroovy: Renderer = (artifacts, _, version) => artifacts
    .map(artifact => `implementation 'org.tinylog:${artifact}:${version}'`)
    .join('\n')

export const gradleKotlin: Renderer = (artifacts, _, version) => artifacts
    .map(artifact => `implementation("org.tinylog:${artifact}:${version}")`)
    .join('\n')

export const ivy: Renderer = (artifacts, _, version) => artifacts
    .map(artifact => `<dependency org="org.tinylog" name="${artifact}" rev="${version}" />`)
    .join('\n')

export const maven: Renderer = (artifacts, _, version) => artifacts
    .map(artifact =>
        line('<dependency>')
        + line('<groupId>org.tinylog</groupId>', 4)
        + line(`<artifactId>${artifact}</artifactId>`, 4)
        + line(`<version>${version}</version>`, 4)
        + line('</dependency>'))
    .map(artifact => artifact.trim())
    .join('\n')

export const p2: Renderer = (_, bundles, version) =>
    line('<location includeAllPlatforms="false" includeConfigurePhase="true" includeMode="planner" includeSource="true" type="InstallableUnit">')
    + line(`<repository location="https://tinylog.org/p2-repository/${version}/" />`, 4)
    + bundles.map(bundle => line(`<unit id="${bundle}" version="0.0.0" />`, 4)).join('')
    + line(`</location>`).trim()

export const sbt: Renderer = (artifacts, _, version) => artifacts
    .map(artifact => `libraryDependencies += "org.tinylog" ${artifact.match(/_.*/) ? '%%' : '%'} "${artifact.replace(/_.*/, '')}" % "${version}"`)
    .join('\n')

function line(content: string, indentation: number = 0) {
    return ' '.repeat(indentation) + content + '\n'
}
