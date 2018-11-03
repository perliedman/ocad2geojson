module.exports = {
  usedSymbolNumbers (ocadFile) {
    return ocadFile.objects.reduce((a, f) => {
      const symbolNum = f.sym
      if (!a.idSet.has(symbolNum)) {
        a.symbolNums.push(symbolNum)
        a.idSet.add(symbolNum)
      }

      return a
    }, { symbolNums: [], idSet: new Set() }).symbolNums
  }
}