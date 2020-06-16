# Strings and Files JS mutator

This is a strings and files mutator written on node js.

It has full file mode and smart strings mode.

You need `node >= 12.0.0`

## Usage

### Full File Mode

Put sample file(s) into directory.

Then run command to full file mutate:

```
node index.js -f <input_dir> <out_files_count>(default:100) <max_mutate_cycles>(default:2)
```

Check out folder for results.


### Smart Strings Mode

Put sample file(s) into directory.

Replace `text` that you want to mutate to {{`text`}}.

Then run command to smart mutate:

```
node index.js -s <input_dir> <out_files_count>(default:100) <max_mutate_cycles>(default:2)
```

Check out folder for results.

## Examples

Full File Mode:

```
node index.js -f in 100 2
```

Smart Strings Mode (only {{text}} mutated):

```
node index.js -s in 100 2
```
