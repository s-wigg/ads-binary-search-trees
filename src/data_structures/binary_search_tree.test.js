import BinarySearchTree from "./binary_search_tree";

const dataStructures = [
  BinarySearchTree,
  // We'll add more next week
];

dataStructures.forEach((TargetDS) => {
  describe(TargetDS, () => {
    let bst;
    beforeEach(() => {
      bst = new TargetDS();
    });

    it("starts empty", () => {
      expect(bst.count()).toBe(0);
    });

    describe("lookup", () => {
      it("returns undefined on an empty tree", () => {
        expect(bst.lookup("test")).toBe(undefined);
      });

      it("returns undefined if the key is not in the tree", () => {
        const keys = ["many", "keys", "for", "this", "tree"];
        keys.forEach((key, i) => {
          bst.insert(key);
        });

        expect(bst.lookup("dne")).toBe(undefined);
      });

      it("finds the only record", () => {
        bst.insert("test");
        expect(bst.lookup("test")).toBeTruthy();
      });

      it("finds any extant record", () => {
        const keys = ["many", "keys", "for", "this", "tree"];
        keys.forEach((key) => {
          bst.insert(key);
        });

        keys.forEach((key) => {
          expect(bst.lookup(key)).toBeTruthy();
        });

        keys.reverse().forEach((key) => {
          expect(bst.lookup(key)).toBeTruthy();
        });
      });

      it("returns the value associated with a record", () => {
        const records = [
          { key: "one", value: "first" },
          { key: "two", value: "second" },
          { key: "three", value: "third" },
          { key: "four", value: "fourth" },
          { key: "five", value: "fifth" },
        ];

        records.forEach(({ key, value }) => {
          bst.insert(key, value);
        });

        records.forEach(({ key, value }) => {
          expect(bst.lookup(key)).toBe(value);
        });

        records.reverse().forEach(({ key, value }) => {
          expect(bst.lookup(key)).toBe(value);
        });
      });
    });

    describe("insert", () => {
      it("increases count by 1", () => {
        expect(bst.count()).toBe(0);
        bst.insert("test");
        expect(bst.count()).toBe(1);

        const keys = ["many", "keys", "for", "this", "tree"];
        keys.forEach((key, i) => {
          bst.insert(key);
          expect(bst.count()).toBe(2 + i);
        });
      });

      it("replaces records with the same key and does not increase the count", () => {
        bst.insert("test", "first value");
        expect(bst.count()).toBe(1);
        expect(bst.lookup("test")).toBe("first value");

        bst.insert("test", "second value");
        expect(bst.count()).toBe(1);
        expect(bst.lookup("test")).toBe("second value");
      });

      it("uses true as the default value", () => {
        bst.insert("test");
        expect(bst.lookup("test")).toBe(true);
      });
    });

    describe("delete", () => {
      let records;
      beforeEach(() => {
        records = [
          { key: "one", value: "first" },
          { key: "two", value: "second" },
          { key: "three", value: "third" },
          { key: "four", value: "fourth" },
          { key: "five", value: "fifth" },
        ];
      });

      const fill = (records) => {
        records.forEach(({ key, value }) => {
          bst.insert(key, value);
        });
      };

      it("returns the value for the removed record", () => {
        records.forEach(({ key, value }) => {
          bst.insert(key, value);
        });

        expect(bst.delete("five")).toBe("fifth");
      });

      it("returns undefined if the record was not found", () => {
        records.forEach(({ key, value }) => {
          bst.insert(key, value);
        });

        expect(bst.delete("fifty")).toBe(undefined);
      });

      it("reduces the count by 1", () => {
        records.forEach(({ key, value }) => {
          bst.insert(key, value);
        });

        bst.delete("two");

        expect(bst.count()).toBe(4);
      });

      it("omits the removed record from iteration results", () => {
        fill(records);

        bst.delete("five");
        bst.delete("two");

        bst.forEach(({ key, _value }) => {
          expect(key).not.toBe("two");
          expect(key).not.toBe("five");
        });
        expect(bst.count()).toBe(3);
      });

      it("can remove every element in a tree", () => {
        const records = [
          { key: "one", value: "first" },
          { key: "two", value: "second" },
        ];

        records.forEach(({ key, value }) => {
          bst.insert(key, value);
        });

        bst.delete("one");
        bst.delete("two");
        expect(bst.count()).toBe(0);
      });

      describe("scenarios", () => {
        it("can remove the record with the smallest key", () => {
          const records = [
            { key: 100, value: "first" },
            { key: 500, value: "second" },
            { key: 5, value: "third" },
            { key: 555, value: "fourth" },
          ];
          fill(records);
          bst.delete(5);

          expect(bst.lookup(5)).toBe(undefined);
          const keys = [100, 500, 555];

          let i = 0;
          bst.forEach(({ key, _value }) => {
            expect(key).not.toBe("5");
            expect(keys[i]).toBe(key);
            i++;
          });

          expect(bst.count()).toBe(3);
        });

        it("can remove the record with the largest key", () => {
          const records = [
            { key: 100, value: "first" },
            { key: 500, value: "second" },
            { key: 5, value: "third" },
            { key: 555, value: "fourth" },
          ];
          fill(records);
          bst.delete(555);

          expect(bst.lookup(555)).toBe(undefined);

          const keys = [5, 100, 500];
          let i = 0;

          bst.forEach(({ key, _value }) => {
            expect(key).not.toBe(555);
            expect(keys[i]).toBe(key);

            i++;
          });
          expect(bst.count()).toBe(3);
        });

        it("can remove the root", () => {
          const records = [{ key: "one", value: "first" }];
          fill(records);
          bst.delete("one");

          expect(bst.lookup("one")).toBe(undefined);
          bst.forEach(({ key, _value }) => {
            expect(key).not.toBe("one");
          });
          expect(bst.count()).toBe(0);
        });

        it("can remove a node with no children", () => {
          const records = [
            { key: "100", value: "first" },
            { key: "500", value: "second" },
          ];
          fill(records);
          bst.delete("500");

          expect(bst.lookup("500")).toBe(undefined);
          bst.forEach(({ key, _value }) => {
            expect(key).not.toBe("by");
          });
          expect(bst.count()).toBe(1);
        });

        it("can remove a node with only a left child", () => {
          const records = [
            { key: 10, value: "first" },
            { key: 5, value: "second" },
            { key: 2, value: "third" },
            { key: 15, value: "fourth" },
          ];
          fill(records);
          bst.delete(2);

          expect(bst.lookup(2)).toBe(undefined);

          const keys = [5, 10, 15];
          let i = 0;

          bst.forEach(({ key, _value }) => {
            expect(key).not.toBe(2);
            expect(keys[i]).toBe(key);
            i++;
          });
          expect(bst.count()).toBe(3);
        });

        it("can remove a node with only a right child", () => {
          const records = [
            { key: 10, value: "first" },
            { key: 5, value: "second" },
            { key: 15, value: "third" },
            { key: 20, value: "fourth" },
          ];
          fill(records);
          bst.delete(15);

          expect(bst.lookup(15)).toBe(undefined);

          const keys = [5, 10, 20];
          let i = 0;

          bst.forEach(({ key, _value }) => {
            expect(key).not.toBe(2);
            expect(keys[i]).toBe(key);
            i++;
          });
          expect(bst.count()).toBe(3);
        });

        it("can remove a node with both children, where the successor is the node's right child", () => {
        });

        it("can remove a node with both children, where the successor is not the node's right child", () => {
          const records = [
            { key: 10, value: "first" },
            { key: 5, value: "second" },
            { key: 15, value: "third" },
            { key: 20, value: "fourth" },
            { key: 13, value: "fifth" },
          ];
          fill(records);
          expect(bst.count()).toBe(5);

          bst.delete(15);
          expect(bst.count()).toBe(4);

          expect(bst.lookup(15)).toBe(undefined);

          const keys = [5, 10, 13, 20];
          let i = 0;

          let test = [];
          bst.forEach(({ key, _value }) => {
            test.push(key);
            expect(key).not.toBe(15);
            expect(keys[i]).toBe(key);
            i++;
          });
        });
      });
    });

    describe("forEach", () => {
      let records;
      beforeEach(() => {
        records = [
          { key: "one", value: "first" },
          { key: "two", value: "second" },
          { key: "three", value: "third" },
          { key: "four", value: "fourth" },
          { key: "five", value: "fifth" },
        ];
      });

      const sortRecords = (records) => {
        return records.sort((a, b) => a.key.localeCompare(b.key));
      };

      const fill = (records) => {
        records.forEach(({ key, value }) => {
          bst.insert(key, value);
        });
      };

      it("runs the callback 0 times on an empty tree", () => {
        const cb = jest.fn();
        bst.forEach(cb);

        expect(cb.mock.calls.length).toBe(0);
      });

      it("provides {key, value}, index and tree as cb args", () => {
        bst.insert("key", "value");

        const cb = jest.fn();
        bst.forEach(cb);

        const callArgs = cb.mock.calls[0];
        expect(callArgs[0].key).toBe("key");
        expect(callArgs[0].value).toBe("value");
        expect(callArgs[1]).toBe(0);
        expect(callArgs[2]).toBe(bst);
      });

      it("iterates records in key order", () => {
        fill(records);

        const cb = jest.fn();
        bst.forEach(cb);

        sortRecords(records).forEach(({ key, value }, i) => {
          const callArgs = cb.mock.calls[i];
          expect(callArgs[0].key).toBe(key);
          expect(callArgs[0].value).toBe(value);
          expect(callArgs[1]).toBe(i);
          expect(callArgs[2]).toBe(bst);
        });
      });

      it("iterates correctly for sorted input", () => {
        fill(sortRecords(records));

        const cb = jest.fn();
        bst.forEach(cb);

        sortRecords(records).forEach(({ key, value }, i) => {
          const callArgs = cb.mock.calls[i];
          expect(callArgs[0].key).toBe(key);
          expect(callArgs[0].value).toBe(value);
          expect(callArgs[1]).toBe(i);
          expect(callArgs[2]).toBe(bst);
        });
      });

      it("iterates correctly for reverse-sorted input", () => {
        fill(sortRecords(records).reverse());

        const cb = jest.fn();
        bst.forEach(cb);

        sortRecords(records).forEach(({ key, value }, i) => {
          const callArgs = cb.mock.calls[i];
          expect(callArgs[0].key).toBe(key);
          expect(callArgs[0].value).toBe(value);
          expect(callArgs[1]).toBe(i);
          expect(callArgs[2]).toBe(bst);
        });
      });
    });
  });
});
