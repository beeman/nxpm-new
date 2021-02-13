import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('web e2e', () => {
  it('should create web', async (done) => {
    const plugin = uniq('web');
    ensureNxProject('@nxpm/web', 'dist/packages/web');
    await runNxCommandAsync(`generate @nxpm/web:web ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('web');
      ensureNxProject('@nxpm/web', 'dist/packages/web');
      await runNxCommandAsync(
        `generate @nxpm/web:web ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('web');
      ensureNxProject('@nxpm/web', 'dist/packages/web');
      await runNxCommandAsync(
        `generate @nxpm/web:web ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});
