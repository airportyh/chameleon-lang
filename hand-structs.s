	.section	__TEXT,__text,regular,pure_instructions
	.macosx_version_min 10, 13
	.section	__TEXT,__literal8,8byte_literals
	.p2align	3               ## -- Begin function main
LCPI0_0:
	.quad	4617878467915022336     ## double 5.5
	.section	__TEXT,__text,regular,pure_instructions
	.globl	_main
	.p2align	4, 0x90
_main:                                  ## @main
	.cfi_startproc
## %bb.0:
	subq	$24, %rsp
	.cfi_def_cfa_offset 32
	movsd	LCPI0_0(%rip), %xmm0    ## xmm0 = mem[0],zero
	movl	$65, 8(%rsp)
	movsd	%xmm0, 16(%rsp)
	movl	8(%rsp), %edi
	callq	_putchar
	xorl	%ecx, %ecx
	movl	%eax, 4(%rsp)           ## 4-byte Spill
	movl	%ecx, %eax
	addq	$24, %rsp
	retq
	.cfi_endproc
                                        ## -- End function
.subsections_via_symbols
